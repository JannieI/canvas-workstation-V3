    selectedUnion: boolean = true;
    selectedIntersect: boolean = false;
    selectedMinus: boolean = false;
    selectedJoin: boolean = false;

    this.selectedUnion = false;
        this.selectedIntersect = false;
        this.selectedMinus = false;
        this.selectedJoin = false;

        if (ev.target.value == 'Union') { this.selectedUnion = true };
        if (ev.target.value == 'Intersect') { this.selectedIntersect = true };
        if (ev.target.value == 'Minus') { this.selectedMinus = true };
        if (ev.target.value == 'Join') { this.selectedJoin = true };
    